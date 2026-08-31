import React, { createContext, useContext, useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const StripeContext = createContext();

/**
 * `loadStripe()` used to run at module scope with whatever
 * VITE_STRIPE_PUBLISHABLE_KEY happened to be. When the key is missing it
 * throws "Cannot read properties of undefined (reading 'match')" as an
 * unhandled rejection on EVERY page load, because StripeProvider wraps the
 * whole app in main.jsx — an unset env var poisoned the console app-wide.
 *
 * Now: no key, no Stripe. Consumers check `stripeEnabled` and hide the
 * payment path instead of crashing.
 */
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripeEnabled = typeof publishableKey === 'string' && publishableKey.startsWith('pk_');

if (!stripeEnabled && import.meta.env.DEV) {
    console.info(
        'Stripe is disabled: VITE_STRIPE_PUBLISHABLE_KEY is not set to a pk_… key. Online rent payment will be hidden.'
    );
}

const stripePromise = stripeEnabled ? loadStripe(publishableKey) : null;

export const StripeProvider = ({ children }) => {
    const value = useMemo(() => ({ stripePromise, stripeEnabled }), []);

    return (
        <StripeContext.Provider value={value}>
            {children}
        </StripeContext.Provider>
    );
};

export const useStripe = () => {
    const context = useContext(StripeContext);
    if (!context) {
        throw new Error('useStripe must be used within StripeProvider');
    }
    return context;
};
