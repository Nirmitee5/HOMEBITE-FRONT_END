import { Colors } from "./theme";

export const HOMEBITE_LOGO = require("../app/assets/images/homebite-logo.png");

const colors = Colors.light;

export const providerTheme = {
  // --------------------------------------------------
  // EXISTING TOKENS
  // Keep these names because your existing screens use them.
  // --------------------------------------------------

  primary: colors.primary,
  primaryDark: colors.primaryDark,
  primaryLight: colors.primaryLight,

  text: colors.text,
  textSecondary: colors.textSecondary,
  textMuted: colors.textMuted,

  bg: colors.surface,
  surface: colors.background,
  surfaceWarm: colors.surfaceWarm,

  border: colors.border,
  divider: colors.divider,

  success: colors.success,
  successLight: colors.successLight,

  warning: colors.warning,
  warningLight: colors.warningLight,

  danger: colors.danger,
  dangerLight: colors.dangerLight,

  info: colors.info,
  infoLight: colors.infoLight,

  // --------------------------------------------------
  // TYPOGRAPHY
  // --------------------------------------------------

  fonts: {
    regular: "Poppins_400Regular",
    medium: "Poppins_500Medium",
    semibold: "Poppins_600SemiBold",
    bold: "Poppins_700Bold",
    extraBold: "Poppins_800ExtraBold",
  },

  typography: {
  display: 38,
  largeHeading: 32,
  heading: 27,
  subheading: 22,
  bodyLarge: 19,
  body: 17,
  bodySmall: 15,
  caption: 13,
},

  // --------------------------------------------------
  // SPACING
  // --------------------------------------------------

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
  },

  // --------------------------------------------------
  // BORDER RADIUS
  // --------------------------------------------------

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    pill: 999,
  },

  // --------------------------------------------------
  // SHADOWS
  // --------------------------------------------------

  shadows: {
    card: {
      shadowColor: "#2A2A2A",
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: 5,
      },
      elevation: 3,
    },

    floating: {
      shadowColor: "#2A2A2A",
      shadowOpacity: 0.1,
      shadowRadius: 16,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      elevation: 5,
    },
  },

  // --------------------------------------------------
  // ICON SIZES
  // --------------------------------------------------

  iconSize: {
    xs: 14,
    sm: 18,
    md: 22,
    lg: 26,
    xl: 32,
  },
};

export const statusMeta: Record<
  string,
  {
    label: string;
    fg: string;
    bg: string;
  }
> = {
  pending: {
    label: "Pending",
    fg: providerTheme.warning,
    bg: providerTheme.warningLight,
  },

  accepted: {
    label: "Accepted",
    fg: providerTheme.info,
    bg: providerTheme.infoLight,
  },

  preparing: {
    label: "Preparing",
    fg: providerTheme.primary,
    bg: providerTheme.primaryLight,
  },

  ready: {
    label: "Ready",
    fg: providerTheme.info,
    bg: providerTheme.infoLight,
  },

  out_for_delivery: {
    label: "On the way",
    fg: providerTheme.info,
    bg: providerTheme.infoLight,
  },

  delivered: {
    label: "Delivered",
    fg: providerTheme.success,
    bg: providerTheme.successLight,
  },

  rejected: {
    label: "Rejected",
    fg: providerTheme.danger,
    bg: providerTheme.dangerLight,
  },

  cancelled: {
    label: "Cancelled",
    fg: providerTheme.textMuted,
    bg: providerTheme.surface,
  },
};

export const providerTypeLabel = {
  housewife: "Housewife Kitchen",
  mess: "Mess",
  home_kitchen: "Home Kitchen",
};