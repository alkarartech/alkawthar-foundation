import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import Colors from '@/constants/colors';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading = false, 
  disabled = false,
  style,
  textStyle
}: ButtonProps) {
  const getButtonStyle = () => {
    if (variant === 'primary') return styles.primaryButton;
    if (variant === 'secondary') return styles.secondaryButton;
    if (variant === 'outline') return styles.outlineButton;
    return styles.primaryButton;
  };

  const getTextStyle = () => {
    if (variant === 'primary') return styles.primaryText;
    if (variant === 'secondary') return styles.secondaryText;
    if (variant === 'outline') return styles.outlineText;
    return styles.primaryText;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? Colors.primary.green : Colors.text.light} />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  primaryButton: {
    backgroundColor: Colors.primary.green,
  },
  secondaryButton: {
    backgroundColor: Colors.primary.gold,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary.green,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryText: {
    color: Colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryText: {
    color: Colors.text.dark,
    fontSize: 16,
    fontWeight: '600',
  },
  outlineText: {
    color: Colors.primary.green,
    fontSize: 16,
    fontWeight: '600',
  },
});