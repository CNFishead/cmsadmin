import { QueryClient } from '@tanstack/react-query';
import ServiceChecker from './components/cards/serviceChecker/ServiceChecker.component';
export interface CardComponentProps {
  data: any; // or AthleteProfile | TeamProfile | etc when you type it
}
export interface Card {
  title: string;
  component: (props: CardComponentProps) => React.ReactNode;
  order?: number; // lower number = higher priority
  size?: number; // NEW: size = column weight (1 = default, 2 = double-width, 3 = triple-width)
  gridKey: string;
  isCard?: boolean;
  hideIf?: ((params: { profile: any; queryClient: QueryClient }) => boolean) | boolean;
}

export default [
  {
    title: 'Service Status',
    component: ({ data }: CardComponentProps) => <ServiceChecker />,
    gridKey: 'service-status',
    order: 1,
    size: 3,
    isCard: false, // Already has its own Card wrapper
  },
] as Card[];
