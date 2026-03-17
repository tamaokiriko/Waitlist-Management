import { StoreProvider } from '@/lib/store';
import { EtableApp } from '@/components/etable/EtableApp';

export default function Home() {
  return (
    <StoreProvider>
      <div className="max-w-md mx-auto bg-background min-h-screen shadow-2xl">
        <EtableApp />
      </div>
    </StoreProvider>
  );
}
