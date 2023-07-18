# Integrate TWAMM

## Getting Started <a href="#getting-started" id="getting-started"></a>

### Integrating TWAMM Lite <a href="#integrating-jupiter-terminal" id="integrating-jupiter-terminal"></a>

In your document, link, and embed main-v1.js.

```html
<script src="https://lite.lp.finance/main-v1.js" />
```

### Preloading TWAMM Lite <a href="#preloading-terminal" id="preloading-terminal"></a>

Assign the attribute data-preload to the script tag, the full application will be preloaded on your browser's `(document.readyState === "complete")` event.

```html
<script src="https://lite.lp.finance/main-v1.js" data-preload />
```

Then,

```tsx
// Use your own private RPC endpoint for production.
const RPC_ENDPOINT = "https://api.mainnet-beta.solana.com"
window.Twamm.init({ endpoint: RPC_ENDPOINT });
```

### Built-in wallets, or passthrough wallets from your dApp <a href="#built-in-wallets-or-passthrough-wallets-from-your-dapp" id="built-in-wallets-or-passthrough-wallets-from-your-dapp"></a>

**Mode 1: Wallet passthrough**

If your user has connected their wallet via your dApp, you may pass through the wallet instance via the `init({ passThroughWallet: wallet })`.

```tsx
const App = () => {
  const { wallet } = useWallet();

  const initJupiter = () => {
    if (wallet) {
      window.Twamm.init({
        endpoint,
        passThroughWallet: wallet,
      });
    }
  };
};

```

**Mode 2: Built-in wallet**

If your user is not connected, TWAMM Lite has several built-in wallets that users can connect to and place orders directly.

### TWAMM Lite Multi-mode <a href="#jupiter-terminal-multi-mode" id="jupiter-terminal-multi-mode"></a>

There are currently 3 modes to integrate TWAMM Lite into your dApp.

* `Modal`: By default, TWAMM renders as a modal and takes up the whole screen.
* `Integrated`: Renders TWAMM as a part of your dApp.
* `Widget`: Renders Twamm as a widget that can be placed in different positions.

#### **Modal**

```tsx
window.Twamm.init({ displayMode: 'modal' });
```

#### **Integrated**
```tsx
window.Twamm.init({ displayMode: 'integrated' });
```
#### **Widget**
```tsx
window.Twamm.init({
  displayMode: 'widget',
  widgetStyle: {
    position: 'bottom-right', // 'bottom-left', 'top-left', 'top-right'
    size: 'default', // 'sm'
    },
});
```
## formProps <a href="#formprops-available-on-v1" id="formprops-available-on-v1"></a>

Configure TWAMM Lite's behavior and allowed actions for your user.

* **feeAccount?: string**
  * Account that receives Jupiter Swap fees.
  * Set to empty string if the frontend should not charge fees.
* **feeBps?: string**
  * Fees charged for Jupiter swaps in BPS.
  * Set to 0 if the frontend should not charge fees.
* **useJupiter?: boolean**
  * Default to true, determines if Jupiter swaps should be displayed in TWAMM Lite.
  * If set to false, instant swap is not supported
* **platformFeeAccount?: string**
  * Default to empty string, provided account receives fees generated when order complete / cancelled
  * Provided account requires to have ATA for all tokens supported on TWAMM. Else, withdraw/cancel order would fail.
* **supportedToken?: \[key: string]: string\[]**
  * Default to using LP Finance Supported Tokens API.
  * Provide supported tokens object to customize.

**Resuming / Closing activity**

* Every time `init()` is called, it will create a new activity.
* If you want to resume the previous activity, you can use `resume()`.
* `close()` function only hides the widget.

```tsx
if (window.Twamm._instance) {
  window.Twamm.resume();
}

window.Twamm.close();
```

**Fees support**

By integrating TWAMM Lite, integrators can earn 100% of the fees generated for orders "cancelled/withdrawn" from the frontend.

Note that the accounts used to collect fees "should" have an ATA for tokens that are supported on TWAMM.

```tsx
window.Twamm.init({
  // ...
  feeAccount: "your address",
  feeBps: "50" // 0.5% fee for Jupiter Swap
  platformFeeAccount: "your address",
});
```

**Customizing styles: CSSProperties**

Any CSS-in-JS can be injected into the outer-most container via containerStyles API.

Examples:

* Custom zIndex

```tsx
window.init({
  // ...
  containerStyles: { zIndex: 100 },
});
```

* Custom height

```tsx
window.Twamm.init({
  // ...
  containerStyles: { maxHeight: '90vh', },
});
```

**Customizing className: Tailwind className**

Tailwind classes can be injected into the outer-most container via containerClassName API.

Example:

* Custom breakpoints

```tsx
window.Twamm.init({
  // ...
  containerClassName: 'max-h-[90vh] lg:max-h-[600px]'
});
```

