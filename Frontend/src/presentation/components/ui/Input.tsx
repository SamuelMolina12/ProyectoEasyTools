/**
 * UI Component: Input
 * Campo de texto con label, icono, validación y estado de error.
 */

import React, { useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: object;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onBlur?.(e);
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [error ? '#e84393' : '#e2e8f0', error ? '#e84393' : '#00c9a7'],
  });

  const labelColor = error ? '#e84393' : isFocused ? '#00c9a7' : '#64748b';

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      <Animated.View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            borderWidth: isFocused || error ? 2 : 1.5,
          },
        ]}
      >
        {leftIcon && (
          <View style={styles.leftIconWrapper}>{leftIcon}</View>
        )}
        <TextInput
          style={[
            styles.input,
            leftIcon ? { paddingLeft: 8 } : null,
            rightIcon ? { paddingRight: 8 } : null,
          ]}
          placeholderTextColor="#94a3b8"
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIconWrapper}
            activeOpacity={0.7}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </Animated.View>
      {error ? (
        <Text style={styles.errorText}>⚠ {error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
    minHeight: 52,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a2e',
    paddingVertical: 0,
  },
  leftIconWrapper: {
    marginRight: 10,
    opacity: 0.6,
  },
  rightIconWrapper: {
    marginLeft: 8,
    padding: 4,
    opacity: 0.7,
  },
  errorText: {
    color: '#e84393',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },
});

export default Input;
