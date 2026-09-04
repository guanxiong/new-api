package controller

import (
	"testing"

	"github.com/QuantumNous/new-api/model"
	"github.com/stretchr/testify/assert"
)

func TestNormalizeTopUpPaymentMethodsAddsExplicitCurrency(t *testing.T) {
	methods := []map[string]string{
		{"name": "WeChat", "type": "wxpay"},
		{"name": "Stripe", "type": model.PaymentMethodStripe},
		{"name": "Waffo", "type": model.PaymentMethodWaffo},
	}

	actual := normalizeTopUpPaymentMethods(methods, "EUR")

	assert.Equal(t, "CNY", actual[0]["currency"])
	assert.Equal(t, "USD", actual[1]["currency"])
	assert.Equal(t, "EUR", actual[2]["currency"])
	assert.NotContains(t, methods[0], "currency", "source settings must not be mutated")
}

func TestNormalizeTopUpPaymentMethodsPreservesExplicitCurrency(t *testing.T) {
	methods := []map[string]string{
		{"name": "Custom", "type": "custom1", "currency": "usd"},
	}

	actual := normalizeTopUpPaymentMethods(methods, "")

	assert.Equal(t, "USD", actual[0]["currency"])
}
