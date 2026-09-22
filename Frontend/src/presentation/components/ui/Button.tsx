/**
 * UI Component: Button
 * Botón reutilizable con variantes de diseño y animación de press.
 */

import React, { useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const VARIANT_STYLES: Record<ButtonVariant, { bg: string; text: string; border?: string; shadow?: string }> = {
  primary: { bg: '#00c9a7', text: '#ffffff', shadow: 'rgba(0,201,167,0.40)' },
  secondary: { bg: '#f39c12', text: '#ffffff', shadow: 'rgba(243,156,18,0.40)' },
  accent: { bg: '#e84393', text: '#ffffff', shadow: 'rgba(232,67,147,0.40)' },
  outline: { bg: 'transparent', text: '#00c9a7', border: '#00c9a7' },
  ghost: { bg: 'rgba(0,201,167,0.08)', text: '#00c9a7' },
};

const SIZE_STYLES: Record<ButtonSize, { py: number; px: number; fontSize: number; height: number }> = {
  sm: { py: 8, px: 16, fontSize: 13, height: 36 },
  md: { py: 14, px: 24, fontSize: 15, height: 50 },
  lg: { py: 18, px: 32, fontSize: 17, height: 58 },
};

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const variantStyle = VARIANT_STYLES[variant];
  const sizeStyle = SIZE_STYLES[size];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const isDisabled = disabled || loading;

  return (
    <Animated.View
      style={[
        fullWidth && styles.fullWidth,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Pressable
        onPress={!isDisabled ? onPress : undefined}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.base,
          {
            backgroundColor: variantStyle.bg,
            height: sizeStyle.height,
            paddingHorizontal: sizeStyle.px,
            borderWidth: variantStyle.border ? 2 : 0,
            borderColor: variantStyle.border ?? 'transparent',
            opacity: isDisabled ? 0.55 : 1,
          },
          variantStyle.shadow && {
            shadowColor: variantStyle.shadow,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 1,
            shadowRadius: 16,
            elevation: 6,
          },
          fullWidth && styles.fullWidth,
        ]}
      >
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator
              color={variantStyle.text}
              size={size === 'sm' ? 'small' : 'small'}
            />
          ) : (
            <>
              {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
              <Text
                style={[
                  styles.label,
                  {
                    color: variantStyle.text,
                    fontSize: sizeStyle.fontSize,
                  },
                ]}
              >
                {label}
              </Text>
              {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
            </>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;
