import { forwardRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { cn } from '../../lib/utils';

export interface InputProps
  extends React.ComponentPropsWithoutRef<typeof TextInput> {
  label?: string;
  labelClasses?: string;
  inputClasses?: string;
  showPasswordToggle?: boolean;
}
const Input = forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ className, label, labelClasses, inputClasses, showPasswordToggle = false, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    
    return (
      <View className={cn('flex flex-col gap-2', className)}>
        {label && <Text className={cn('text-base font-medium text-gray-700 font-body', labelClasses)}>{label}</Text>}
        <View className="relative">
          <TextInput
            ref={ref}
            className={cn(
              inputClasses,
              'rounded-lg text-base bg-white py-2',
              showPasswordToggle ? 'pr-12' : ''
            )}
            secureTextEntry={showPasswordToggle && !isPasswordVisible}
            {...props}
          />
          {showPasswordToggle && (
            <TouchableOpacity
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Text className="text-gray-500 font-body text-sm">
                {isPasswordVisible ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
);
Input.displayName = 'Input';

export { Input };
