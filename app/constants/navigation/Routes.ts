const Routes = {
  WALLET_VIEW: 'WalletView',
  BROWSER_TAB_HOME: 'BrowserTabHome',
  BROWSER_URL_MODAL: 'BrowserUrlModal',
  BROWSER_VIEW: 'BrowserView',
  SETTINGS_VIEW: 'SettingsView',
  DEPRECATED_NETWORK_DETAILS: 'DeprecatedNetworkDetails',
  RAMP: {
    ID: 'Ramp',
    BUY: 'RampBuy',
    SELL: 'RampSell',
    GET_STARTED: 'GetStarted',
    PAYMENT_METHOD: 'PaymentMethod',
    PAYMENT_METHOD_HAS_STARTED: 'PaymentMethodHasStarted',
    BUILD_QUOTE: 'BuildQuote',
    BUILD_QUOTE_HAS_STARTED: 'BuildQuoteHasStarted',
    QUOTES: 'Quotes',
    CHECKOUT: 'Checkout',
    REGION: 'Region',
    REGION_HAS_STARTED: 'RegionHasStarted',
    NETWORK_SWITCHER: 'BuyNetworkSwitcher',
    ORDER_DETAILS: 'OrderDetails',
    SEND_TRANSACTION: 'SendTransaction',
    SETTINGS: 'RampSettings',
    ACTIVATION_KEY_FORM: 'RampActivationKeyForm',
  },
  HW: {
    CONNECT: 'ConnectHardwareWalletFlow',
    SELECT_DEVICE: 'SelectHardwareWallet',
    CONNECT_QR_DEVICE: 'ConnectQRHardwareFlow',
    CONNECT_LEDGER: 'ConnectLedgerFlow',
    LEDGER_CONNECT: 'LedgerConnect',
  },
  LEDGER_MESSAGE_SIGN_MODAL: 'LedgerMessageSignModal',
  LEDGER_TRANSACTION_MODAL: 'LedgerTransactionModal',
  QR_TAB_SWITCHER: 'QRTabSwitcher',
  OPTIONS_SHEET: 'OptionsSheet',
  QR_SCANNER: 'QRScanner',
  TRANSACTIONS_VIEW: 'TransactionsView',
  MODAL: {
    DELETE_WALLET: 'DeleteWalletModal',
    ROOT_MODAL_FLOW: 'RootModalFlow',
    MODAL_CONFIRMATION: 'ModalConfirmation',
    MODAL_MANDATORY: 'ModalMandatory',
    WHATS_NEW: 'WhatsNewModal',
    SMART_TRANSACTIONS_OPT_IN: 'SmartTransactionsOptInModal',
    TURN_OFF_REMEMBER_ME: 'TurnOffRememberMeModal',
    UPDATE_NEEDED: 'UpdateNeededModal',
    ENABLE_AUTOMATIC_SECURITY_CHECKS: 'EnableAutomaticSecurityChecksModal',
    DETECTED_TOKENS: 'DetectedTokens',
    SRP_REVEAL_QUIZ: 'SRPRevealQuiz',
    WALLET_ACTIONS: 'WalletActions',
    NFT_AUTO_DETECTION_MODAL: 'NFTAutoDetectionModal',
    MULTI_RPC_MIGRATION_MODAL: 'MultiRPcMigrationModal',
  },
  ONBOARDING: {
    ROOT_NAV: 'OnboardingRootNav',
    SUCCESS_FLOW: 'OnboardingSuccessFlow',
    SUCCESS: 'OnboardingSuccess',
    DEFAULT_SETTINGS: 'DefaultSettings',
    GENERAL_SETTINGS: 'GeneralSettings',
    ASSETS_SETTINGS: 'AssetsSettings',
    SECURITY_SETTINGS: 'SecuritySettings',
    HOME_NAV: 'HomeNav',
    ONBOARDING: 'Onboarding',
    LOGIN: 'Login',
    NAV: 'OnboardingNav',
    MANUAL_BACKUP: {
      STEP_3: 'ManualBackupStep3',
    },
    IMPORT_FROM_SECRET_RECOVERY_PHRASE: 'ImportFromSecretRecoveryPhrase',
  },
  SEND_FLOW: {
    SEND_TO: 'SendTo',
    AMOUNT: 'Amount',
    CONFIRM: 'Confirm',
  },
  ACCOUNT_BACKUP: {
    STEP_1_B: 'AccountBackupStep1B',
  },
  SETTINGS: {
    ADVANCED_SETTINGS: 'AdvancedSettings',
    CHANGE_PASSWORD: 'ResetPassword',
    CONTACT_FORM: 'ContactForm',
    DEVELOPER_OPTIONS: 'DeveloperOptions',
    EXPERIMENTAL_SETTINGS: 'ExperimentalSettings',
    NOTIFICATIONS: 'NotificationsSettings',
    REVEAL_PRIVATE_CREDENTIAL: 'RevealPrivateCredentialView',
    SDK_SESSIONS_MANAGER: 'SDKSessionsManager',
  },
  SHEET: {
    ACCOUNT_SELECTOR: 'AccountSelector',
    AMBIGUOUS_ADDRESS: 'AmbiguousAddress',
    BASIC_FUNCTIONALITY: 'BasicFunctionality',
    PROFILE_SYNCING: 'ProfileSyncing',
    RESET_NOTIFICATIONS: 'ResetNotifications',
    SDK_LOADING: 'SDKLoading',
    SDK_FEEDBACK: 'SDKFeedback',
    DATA_COLLECTION: 'DataCollection',
    EXPERIENCE_ENHANCER: 'ExperienceEnhancer',
    SDK_MANAGE_CONNECTIONS: 'SDKManageConnections',
    SDK_DISCONNECT: 'SDKDisconnect',
    ACCOUNT_CONNECT: 'AccountConnect',
    ACCOUNT_PERMISSIONS: 'AccountPermissions',
    REVOKE_ALL_ACCOUNT_PERMISSIONS: 'RevokeAllAccountPermissions',
    NETWORK_SELECTOR: 'NetworkSelector',
    RETURN_TO_DAPP_MODAL: 'ReturnToDappModal',
    ACCOUNT_ACTIONS: 'AccountActions',
    FIAT_ON_TESTNETS_FRICTION: 'SettingsAdvancedFiatOnTestnetsFriction',
    SHOW_IPFS: 'ShowIpfs',
    SHOW_NFT_DISPLAY_MEDIA: 'ShowNftDisplayMedia',
    SHOW_TOKEN_ID: 'ShowTokenId',
    ORIGIN_SPAM_MODAL: 'OriginSpamModal',
    TOOLTIP_MODAL: 'tooltipModal',
    TOKEN_SORT: 'TokenSort',
    CHANGE_IN_SIMULATION_MODAL: 'ChangeInSimulationModal',
  },
  BROWSER: {
    HOME: 'BrowserTabHome',
    URL_MODAL: 'BrowserUrlModal',
    VIEW: 'BrowserView',
  },
  WEBVIEW: {
    MAIN: 'Webview',
    SIMPLE: 'SimpleWebview',
  },
  WALLET: {
    HOME: 'WalletTabHome',
    TAB_STACK_FLOW: 'WalletTabStackFlow',
    WALLET_CONNECT_SESSIONS_VIEW: 'WalletConnectSessionsView',
  },
  VAULT_RECOVERY: {
    RESTORE_WALLET: 'RestoreWallet',
    WALLET_RESTORED: 'WalletRestored',
    WALLET_RESET_NEEDED: 'WalletResetNeeded',
  },
  ADD_NETWORK: 'AddNetwork',
  EDIT_NETWORK: 'EditNetwork',
  SWAPS: 'Swaps',
  LOCK_SCREEN: 'LockScreen',
  NOTIFICATIONS: {
    VIEW: 'NotificationsView',
    OPT_IN: 'OptIn',
    OPT_IN_STACK: 'OptInStack',
    DETAILS: 'NotificationsDetails',
  },
  STAKING: {
    STAKE: 'Stake',
    STAKE_CONFIRMATION: 'StakeConfirmation',
    UNSTAKE: 'Unstake',
    UNSTAKE_CONFIRMATION: 'UnstakeConfirmation',
    CLAIM: 'Claim',
    MODALS: {
      LEARN_MORE: 'LearnMore',
      MAX_INPUT: 'MaxInput',
    },
  },
  ///: BEGIN:ONLY_INCLUDE_IF(external-snaps)
  SNAPS: {
    SNAPS_SETTINGS_LIST: 'SnapsSettingsList',
    SNAP_SETTINGS: 'SnapSettings',
  },
  ///: END:ONLY_INCLUDE_IF
  FOX_LOADER: 'FoxLoader',
};

export default Routes;
