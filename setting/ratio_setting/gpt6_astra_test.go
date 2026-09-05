package ratio_setting

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestGPT6AstraDefaultRatios(t *testing.T) {
	InitRatioSettings()

	modelRatio, ok, matchedModel := GetModelRatio("gpt-6-astra")
	require.True(t, ok)
	require.Equal(t, "gpt-6-astra", matchedModel)
	require.Equal(t, 5.0, modelRatio)
	require.Equal(t, 5.0, GetCompletionRatio("gpt-6-astra"))

	cacheRatio, ok := GetCacheRatio("gpt-6-astra")
	require.True(t, ok)
	require.Equal(t, 0.1, cacheRatio)

	cacheCreationRatio, ok := GetCreateCacheRatio("gpt-6-astra")
	require.True(t, ok)
	require.Equal(t, 1.25, cacheCreationRatio)
}
