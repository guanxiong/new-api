package model

import (
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/setting/operation_setting"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestNormalizeSubscriptionCurrency(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
		wantErr  bool
	}{
		{name: "defaults legacy empty value to USD", input: "", expected: SubscriptionCurrencyUSD},
		{name: "normalizes CNY", input: " cny ", expected: SubscriptionCurrencyCNY},
		{name: "keeps USD", input: "USD", expected: SubscriptionCurrencyUSD},
		{name: "rejects unsupported currency", input: "EUR", wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			actual, err := NormalizeSubscriptionCurrency(tt.input)
			if tt.wantErr {
				require.Error(t, err)
				return
			}
			require.NoError(t, err)
			assert.Equal(t, tt.expected, actual)
		})
	}
}

func TestConvertSubscriptionPrice(t *testing.T) {
	tests := []struct {
		name         string
		amount       float64
		fromCurrency string
		toCurrency   string
		cnyPerUSD    float64
		expected     float64
	}{
		{name: "keeps CNY checkout amount", amount: 59, fromCurrency: SubscriptionCurrencyCNY, toCurrency: SubscriptionCurrencyCNY, cnyPerUSD: 7.3, expected: 59},
		{name: "converts USD plan to CNY checkout", amount: 10, fromCurrency: SubscriptionCurrencyUSD, toCurrency: SubscriptionCurrencyCNY, cnyPerUSD: 7.3, expected: 73},
		{name: "converts CNY plan to wallet USD", amount: 73, fromCurrency: SubscriptionCurrencyCNY, toCurrency: SubscriptionCurrencyUSD, cnyPerUSD: 7.3, expected: 10},
		{name: "keeps USD wallet amount", amount: 10, fromCurrency: SubscriptionCurrencyUSD, toCurrency: SubscriptionCurrencyUSD, cnyPerUSD: 7.3, expected: 10},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			actual, err := ConvertSubscriptionPrice(tt.amount, tt.fromCurrency, tt.toCurrency, tt.cnyPerUSD)
			require.NoError(t, err)
			assert.InDelta(t, tt.expected, actual, 0.000001)
		})
	}
}

func TestConvertSubscriptionPriceRejectsInvalidExchangeRate(t *testing.T) {
	_, err := ConvertSubscriptionPrice(59, SubscriptionCurrencyCNY, SubscriptionCurrencyUSD, 0)
	require.Error(t, err)
}

func TestCalcSubscriptionBalanceQuotaUsesCheckoutCurrency(t *testing.T) {
	previousPrice := operation_setting.Price
	previousQuotaPerUnit := common.QuotaPerUnit
	t.Cleanup(func() {
		operation_setting.Price = previousPrice
		common.QuotaPerUnit = previousQuotaPerUnit
	})

	operation_setting.Price = 1
	common.QuotaPerUnit = 500_000

	quota, err := calcSubscriptionBalanceQuota(59, SubscriptionCurrencyCNY)
	require.NoError(t, err)
	assert.Equal(t, 29_500_000, quota)
}
