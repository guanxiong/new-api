package billing_setting

import (
	"testing"

	"github.com/QuantumNous/new-api/pkg/billingexpr"
	"github.com/stretchr/testify/require"
)

func TestGPT6AstraDefaultBilling(t *testing.T) {
	require.Equal(t, BillingModeTieredExpr, GetBillingMode(gpt6AstraModel))

	expr, ok := GetBillingExpr(gpt6AstraModel)
	require.True(t, ok)
	require.NoError(t, SmokeTestExpr(expr))

	tests := []struct {
		name     string
		params   billingexpr.TokenParams
		wantCost float64
		wantTier string
	}{
		{
			name: "standard pricing at boundary",
			params: billingexpr.TokenParams{
				P: 100_000, C: 10_000, Len: 272_000, CR: 20_000, CC: 5_000,
			},
			wantCost: 1_582_500,
			wantTier: "standard",
		},
		{
			name: "long context pricing past boundary",
			params: billingexpr.TokenParams{
				P: 100_000, C: 10_000, Len: 272_001, CR: 20_000, CC: 5_000,
			},
			wantCost: 2_915_000,
			wantTier: "long_context",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			cost, trace, err := billingexpr.RunExpr(expr, tt.params)
			require.NoError(t, err)
			require.Equal(t, tt.wantCost, cost)
			require.Equal(t, tt.wantTier, trace.MatchedTier)
		})
	}
}
