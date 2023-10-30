export function Home() {
  return (
    <div className="prose prose-slate dark:prose-invert ">
      <h1>React TypeScript Starter Kit</h1>
      <p>
        This starter kit is designed to get you started building your next lean, fast, easy to hack
        project. It uses <a href="https://reactrouter.com/en/main">React Router</a>,{' '}
        <a href="https://tailwindcss.com/">Tailwind</a>, <a href="https://vitejs.dev/">Vite</a>, and{' '}
        <a href="https://github.com/fireproof-storage/fireproof">Fireproof</a>, and includes ready
        to rock routes, authentication, and a basic data model, so you'll have a winning app in no
        time.
      </p>
      <p>
        The first step is:
        <br />
        <code>git clone https://github.com/fireproof-storage/react-typescript-starter-kit.git</code>
      </p>
      <p>
        Edit routes in <code>App.tsx</code>, this copy in <code>Home.tsx</code>, and the sidebar in{' '}
        <code>Sidebar.tsx</code>. This starter kit ships with a Login component (
        <code>components/Login.tsx</code>) and Storylines (<code>components/Storylines.tsx</code>) with
        Items (<code>components/Items.tsx</code>), which you can rename and use as a starting point
        for your own app's data.
      </p>
      <p>
        Just a few ides for how to use this starter kit:
        <ul>
          <li>
            To create a <a href="https://public-media.fireproof.storage">photo gallery app.</a>
          </li>
          <li>As the basis for a blog.</li>
          <li>To build a collaborative data-gathering app.</li>
          <li>As a starting point for a todo app.</li>
        </ul>
        There are more ideas in the{' '}
        <a href="https://github.com/fireproof-storage/fireproof/discussions/6">
          Fireproof example apps discussions thread
        </a>
        . If you build something cool, please share it there!
      </p>
      <p>
        If you need help, please{' '}
        <a href="https://discord.gg/JkDbYXUG7W">join the Fireproof Discord server</a> and ask in the{' '}
        <code>#help</code> channel. If you find a bug, please{' '}
        <a href="https://github.com/fireproof-storage/react-typescript-starter-kit">
          open an issue
        </a>{' '}
        on GitHub.
      </p>
    </div>
  )
}
