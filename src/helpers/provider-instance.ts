import {ProviderInterface} from '@haqq/provider-base';
import {ProviderHotReactNative} from '@haqq/provider-hot-react-native';
import {ProviderLedgerReactNative} from '@haqq/provider-ledger-react-native';
import {ProviderMnemonicReactNative} from '@haqq/provider-mnemonic-react-native';
import {ProviderSSSReactNative} from '@haqq/provider-sss-react-native';

import {app} from '@app/contexts';
import {getProviderStorage} from '@app/helpers/get-provider-storage';
import {Wallet} from '@app/models/wallet';
import {WalletType} from '@app/types';
import {LEDGER_APP} from '@app/variables/common';

const cache = new Map();

function getId(wallet: Wallet) {
  switch (wallet.type) {
    case WalletType.mnemonic:
    case WalletType.hot:
    case WalletType.ledgerBt:
    case WalletType.sss:
      return wallet.accountId ?? '';
  }
}

export function hasProviderInstanceForWallet(wallet: Wallet) {
  return cache.has(getId(wallet));
}

export function abortProviderInstanceForWallet(wallet: Wallet) {
  if (hasProviderInstanceForWallet(wallet)) {
    cache.get(getId(wallet)).abort();
  }
}

export function removeProviderInstanceForWallet(wallet: Wallet) {
  let id = getId(wallet);
  let instance = cache.get(id);
  if (instance) {
    instance.abort();
    instance = null;
    cache.delete(id);
  }
}

export async function getProviderInstanceForWallet(
  wallet: Wallet,
): Promise<ProviderInterface> {
  const id = getId(wallet);
  if (!hasProviderInstanceForWallet(wallet)) {
    switch (wallet.type) {
      case WalletType.mnemonic:
        cache.set(
          id,
          new ProviderMnemonicReactNative({
            account: wallet.accountId!,
            getPassword: app.getPassword.bind(app),
          }),
        );
        break;
      case WalletType.hot:
        cache.set(
          id,
          new ProviderHotReactNative({
            getPassword: app.getPassword.bind(app),
            account: wallet.accountId!,
          }),
        );
        break;
      case WalletType.ledgerBt:
        cache.set(
          id,
          new ProviderLedgerReactNative({
            getPassword: app.getPassword.bind(app),
            deviceId: wallet.accountId!,
            appName: LEDGER_APP,
          }),
        );
        break;
      case WalletType.sss:
        const storage = await getProviderStorage(wallet.accountId as string);
        cache.set(
          id,
          new ProviderSSSReactNative({
            storage,
            getPassword: app.getPassword.bind(app),
            account: wallet.accountId!,
          }),
        );
        break;
      default:
        throw new Error('transport_not_implemented');
    }
  }

  return cache.get(id);
}
