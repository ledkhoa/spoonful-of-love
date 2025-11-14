# Inter Font Usage Guide

The Inter font family is now configured throughout the app. Here's how to use different font weights:

## Font Weight Classes

### Regular (400)

- Default font weight for all text
- Use: `font-normal` or no class (default)
- Font family: `Inter_400Regular`

### Medium (500)

- Use: `font-medium`
- Font family: `Inter_500Medium`
- Best for: Slightly emphasized text, labels

### Semi-Bold (600)

- Use: `font-semibold`
- Font family: `Inter_600SemiBold`
- Best for: Headings, important labels

### Bold (700)

- Use: `font-bold`
- Font family: `Inter_700Bold`
- Best for: Primary headings, strong emphasis

## Examples

```tsx
// Regular (default)
<Text className="text-base">Regular text</Text>

// Medium
<Text className="text-base font-medium">Medium weight text</Text>

// Semi-bold
<Text className="text-lg font-semibold">Semi-bold heading</Text>

// Bold
<Text className="text-2xl font-bold">Bold heading</Text>
```

## Alternative: Using style prop

If you need to use the style prop directly:

```tsx
import { Text } from 'react-native';

<Text style={{ fontFamily: 'Inter_400Regular' }}>Regular</Text>
<Text style={{ fontFamily: 'Inter_500Medium' }}>Medium</Text>
<Text style={{ fontFamily: 'Inter_600SemiBold' }}>Semi-bold</Text>
<Text style={{ fontFamily: 'Inter_700Bold' }}>Bold</Text>
```

## Notes

- Inter is now the default font for all text in the app
- All existing Tailwind font utility classes (font-normal, font-medium, font-semibold, font-bold) now use Inter
- No changes needed to existing code - it will automatically use Inter
