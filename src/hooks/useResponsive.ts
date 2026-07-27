import { useWindowDimensions } from 'react-native';

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isSmall = width < 375;
  const isMedium = width >= 375 && width < 768;
  const isLarge = width >= 768;
  const isTablet = width >= 768;

  const horizontalPadding = isTablet ? 32 : isSmall ? 16 : 20;
  const cardColumns = isTablet ? 2 : 1;
  const fontScale = isSmall ? 0.92 : 1;

  return {
    width,
    height,
    isSmall,
    isMedium,
    isLarge,
    isTablet,
    horizontalPadding,
    cardColumns,
    fontScale,
  };
}
