package model

import (
	"encoding/json"
	"fmt"
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func insertUsersForPaginationTest(t *testing.T, total int) {
	t.Helper()
	for id := 1; id <= total; id++ {
		user := &User{
			Id:          id,
			Username:    fmt.Sprintf("user%02d", id),
			Password:    "password123",
			DisplayName: fmt.Sprintf("User %02d", id),
			Email:       fmt.Sprintf("user%02d@example.com", id),
			Role:        common.RoleCommonUser,
			Status:      common.UserStatusEnabled,
			Group:       "default",
			AffCode:     fmt.Sprintf("aff%02d", id),
		}
		require.NoError(t, DB.Create(user).Error)
	}
}

func collectUserIDs(users []*User) []int {
	ids := make([]int, 0, len(users))
	for _, user := range users {
		ids = append(ids, user.Id)
	}
	return ids
}

func TestGetAllUsersSortsBeforePagination(t *testing.T) {
	truncateTables(t)
	insertUsersForPaginationTest(t, 42)

	pageOne, total, err := GetAllUsers(&common.PageInfo{Page: 1, PageSize: 20}, NewUserSortOptions("id", "asc"))
	require.NoError(t, err)
	assert.Equal(t, int64(42), total)
	assert.Equal(t, []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20}, collectUserIDs(pageOne))

	pageTwo, total, err := GetAllUsers(&common.PageInfo{Page: 2, PageSize: 20}, NewUserSortOptions("id", "asc"))
	require.NoError(t, err)
	assert.Equal(t, int64(42), total)
	assert.Equal(t, []int{21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40}, collectUserIDs(pageTwo))

	pageThree, total, err := GetAllUsers(&common.PageInfo{Page: 3, PageSize: 20}, NewUserSortOptions("id", "asc"))
	require.NoError(t, err)
	assert.Equal(t, int64(42), total)
	assert.Equal(t, []int{41, 42}, collectUserIDs(pageThree))
}

func TestSearchUsersSortsBeforePagination(t *testing.T) {
	truncateTables(t)
	insertUsersForPaginationTest(t, 42)

	users, total, err := SearchUsers("user", "", nil, nil, 20, 20, NewUserSortOptions("id", "asc"))
	require.NoError(t, err)
	assert.Equal(t, int64(42), total)
	assert.Equal(t, []int{21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40}, collectUserIDs(users))
}

func TestGetAllUsersIncludesActiveSubscriptionQuotaSummary(t *testing.T) {
	truncateTables(t)
	insertUsersForPaginationTest(t, 2)
	now := common.GetTimestamp()

	require.NoError(t, DB.Create(&[]UserSubscription{
		{UserId: 1, AmountTotal: 1_000, AmountUsed: 250, StartTime: now - 60, EndTime: now + 3600, Status: "active"},
		{UserId: 1, AmountTotal: 500, AmountUsed: 100, StartTime: now - 60, EndTime: now + 3600, Status: "active"},
		{UserId: 1, AmountTotal: 9_999, AmountUsed: 1, StartTime: now - 7200, EndTime: now - 1, Status: "active"},
		{UserId: 1, AmountTotal: 9_999, AmountUsed: 1, StartTime: now - 60, EndTime: now + 3600, Status: "cancelled"},
		{UserId: 2, AmountTotal: 0, AmountUsed: 123, StartTime: now - 60, EndTime: now + 3600, Status: "active"},
	}).Error)

	users, _, err := GetAllUsers(&common.PageInfo{Page: 1, PageSize: 20}, NewUserSortOptions("id", "asc"))
	require.NoError(t, err)
	require.Len(t, users, 2)

	encoded, err := json.Marshal(users)
	require.NoError(t, err)
	var payload []map[string]any
	require.NoError(t, json.Unmarshal(encoded, &payload))

	assert.Equal(t, float64(2), payload[0]["active_subscription_count"])
	assert.Equal(t, float64(1_500), payload[0]["subscription_total_quota"])
	assert.Equal(t, float64(350), payload[0]["subscription_used_quota"])
	assert.Equal(t, float64(1_150), payload[0]["subscription_remaining_quota"])
	assert.Equal(t, false, payload[0]["subscription_unlimited"])

	assert.Equal(t, float64(1), payload[1]["active_subscription_count"])
	assert.Equal(t, true, payload[1]["subscription_unlimited"])

	status := common.UserStatusEnabled
	searched, _, err := SearchUsers("user01", "", nil, &status, 0, 20, NewUserSortOptions("id", "asc"))
	require.NoError(t, err)
	require.Len(t, searched, 1)
	assert.Equal(t, int64(2), searched[0].ActiveSubscriptionCount)
	assert.Equal(t, int64(1_150), searched[0].SubscriptionRemainingQuota)
}
