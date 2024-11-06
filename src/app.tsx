import { AdaptiveImage } from "./components/adaptive-image";
import { Cursor } from "./components/cursor";
import { CursorProvider } from "./components/cursor-context";

const App = () => {
  return (
    <>
    <CursorProvider>
      <Cursor />
      <main className="cursor-none bg-black text-white flex h-svh w-full flex items-center justify-center">
        <section>
          <AdaptiveImage />
        </section>
      </main>
    </CursorProvider>
</>
  );
};

export default App;
