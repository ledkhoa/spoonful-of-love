import ColorShowcase from '@/components/ColorShowcase';
import IconExamples from '@/components/IconExamples';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  return (
    <SafeAreaView
      className='flex-1 bg-primary-500'
      edges={['top', 'left', 'right']}
    >
      <ColorShowcase />
      <IconExamples />
    </SafeAreaView>
  );
}
