import { VirtualKeyboard } from "@extension/ui";

export default function App() {
  return (
    <div className="pointer-events-auto absolute bottom-4 w-full">
      <VirtualKeyboard />
    </div>
  );
}
