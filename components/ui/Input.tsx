import { forwardRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { cn } from '../../lib/utils';
import { Icons } from '../icons';

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
      <View className={cn('flex flex-col gap-1 bg-white border-2 border-gray-200 focus:border-[#1F2747]', className)}>
        {label && <Text className={cn('text-base font-medium text-gray-500 font-body', labelClasses)}>{label}</Text>}
        <View className="relative rounded-lg">
          <TextInput
            ref={ref}
            className={cn(
              inputClasses,
              'rounded-lg text-lg py-3 leading-tight',
              showPasswordToggle ? 'pr-12' : ''
            )}
            secureTextEntry={showPasswordToggle && !isPasswordVisible}
            {...props}
          />
          {showPasswordToggle && (
            <TouchableOpacity
              className="absolute right-0 top-0 bottom-0 flex items-center justify-center"
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? <Icons.eye color="gray" /> : <Icons.eyeOff color="gray" />}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
);
Input.displayName = 'Input';

export { Input };
