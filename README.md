# 📦 ScopedState - Gerenciador de Estado de Escopo

ScopedState é uma solução moderna e prática para o gerenciamento de estado em aplicações React. Com ela, você pode definir e acessar variáveis globais e outras informações de forma segmentada e centralizada, eliminando a necessidade de prop drilling e múltiplos useStates.

A biblioteca oferece persistência automática de dados utilizando localStorage no lado do cliente, além de suporte opcional a cookies para o lado do servidor. Isso garante que seus dados permaneçam sincronizados e acessíveis em toda a aplicação.

Com ScopedState, você simplifica o desenvolvimento e melhora a eficiência do gerenciamento de estado, permitindo que você se concentre no que realmente importa: construir experiências incríveis para seus usuários.

## 🚀 Instalação

```sh
npm install scopedstate
```

ou

```sh
yarn add scopedstate
```

## 📌 Uso

### Envolvendo o aplicativo com o Provider

```tsx
import { ScopedStateProvider } from "scopedstate";

function App() {
  return (
    <ScopedStateProvider>
      <MyComponent />
    </ScopedStateProvider>
  );
}
```

### Consumindo o estado no componente

```tsx
import { useScopedState } from "scopedstate";

function MyComponent() {
    const scopedState = useScopedState('userScope');
    const ServerScope = useScopedState('ServerScope', { server: true }); /*Método para persistir via Cookie*/
    
    // Obtém o estado inicial do usuário
    const user = scopedState.get<{ name: string; lastName: string }>('user');
    const tokenStore = ServerScope.get<{ token: string }>("Server");

    // Utiliza clearIndex para remover somente o campo "name" do objeto "user"
    const handleClearName = async () => {
        await scopedState.clearIndex("userScope", "user", 'name');
    };

    // Utiliza clearIndex para remover somente o campo "lastName" do objeto "user"
    const handleClearlastName = async () => {
        await scopedState.clearIndex('userScope', "user", "lastName");
    };

    // Utiliza clearKey para para remover o Objeto "server" do escopo "ServerScope"
    const handleClearToken = async () => {
        await ServerScope.clearKey('ServerScope', "Server");
    };

    // Utiliza clearAll para para remover todos os Objetos do escopo "ServerScope" e "userScope"
    const handleClearAll = async () => {
        await scopedState.clearAll('userScope');
        await ServerScope.clearAll('ServerScope');

    };

    // Utiliza set para registrar o parametro "{token: 'TokenForTest'}" no Objeto "Server"
    const handleConfirmToken = () => {
        ServerScope.set("Server", {token: 'TokenForTest'} );
    };

    return (
        <div>
            <p>Name: {user?.name}</p>
            <button onClick={() => scopedState.update('user', { name: 'Update Name' })}>
                Update Name
            </button>

            <button
                onClick={handleClearName}
            >
                Clear Name
            </button>


            <p>NameLast: {user?.lastName}</p>
            <button
                onClick={handleClearlastName}
            >
                Clear Last Name
            </button>

            <p>Token: {tokenStore?.token}</p>
            <button onClick={handleConfirmToken}>
                Add New Token
            </button>
            <button
                onClick={handleClearToken}
            >
                Clear Token
            </button>


            <button onClick={handleClearAll}>
                Clear All
            </button>

        </div>
    );
}
```



## 🛠️ Recursos
- 🔹 Estado global simples e eficiente.
- 🔹 Suporte a múltiplos escopos de estado.
- 🔹 Persistência via `localStorage` focado no lado cliente do Next.js.
- 🔹 Persistência via `Cookie`(opcional) focado no lado servidor do Next.js.
- 🔹 Elimina a necessidade de prop drilling e múltiplos `useStates`.


### Exemplo de middleware utilizando Cookie
```tsx
import {NextRequest, NextResponse} from 'next/server'


export async function middleware(request: NextRequest) {
    const cookieValue = request.cookies.get("scopedState_verificarScope")?.value;
    const scopedState = cookieValue ? JSON.parse(cookieValue) : null;

    const token = scopedState?.verificar.token ?? undefined;

    if (!token && request.nextUrl.pathname === '/teste') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next(); // Continua a requisição normalmente
}

export const config = {
    matcher: ['/teste'] // Utiliza o array diretamente aqui
};


```

## 🤝 Contribuição
Fique à vontade para abrir issues e pull requests.

## 📄 Licença
Este projeto está sob a licença MIT.

---
--
---

# 📦 ScopedState - Scoped State Manager

ScopedState is a modern and practical solution for state management in React applications. With it, you can define and access global variables and other data in a segmented, centralized manner, eliminating the need for prop drilling and multiple useStates.

The library provides automatic data persistence via localStorage on the client side, along with optional cookie support on the server side. This ensures your data remains synchronized and accessible throughout your entire application.

With ScopedState, you simplify development and enhance state management efficiency, allowing you to focus on what truly matters: building amazing experiences for your users.

## 🚀 Installation

```sh
npm install scopedstate
```

or

```sh
yarn add scopedstate
```

## 📌 Usage

### Wrapping the application with the Provider

```tsx
import { ScopedStateProvider } from "scopedstate";

function App() {
  return (
    <ScopedStateProvider>
      <MyComponent />
    </ScopedStateProvider>
  );
}
```

### Consuming state in a component

```tsx
import { useScopedState } from "scopedstate";

function MyComponent() {
    const scopedState = useScopedState('userScope');
    const ServerScope = useScopedState('ServerScope', { server: true }); // Method for persisting via Cookie

    // Retrieve the initial state of the user
    const user = scopedState.get<{ name: string; lastName: string }>('user');
    const tokenStore = ServerScope.get<{ token: string }>("Server");

    // Use clearIndex to remove only the "name" field from the "user" object
    const handleClearName = async () => {
        await scopedState.clearIndex("userScope", "user", 'name');
    };

    // Use clearIndex to remove only the "lastName" field from the "user" object
    const handleClearLastName = async () => {
        await scopedState.clearIndex('userScope', "user", "lastName");
    };

    // Use clearKey to remove the "server" object from the "ServerScope"
    const handleClearToken = async () => {
        await ServerScope.clearKey('ServerScope', "Server");
    };

    // Use clearAll to remove all objects from "ServerScope" and "userScope"
    const handleClearAll = async () => {
        await scopedState.clearAll('userScope');
        await ServerScope.clearAll('ServerScope');
    };

    // Use set to store the parameter "{token: 'TokenForTest'}" in the "Server" object
    const handleConfirmToken = () => {
        ServerScope.set("Server", { token: 'TokenForTest' });
    };

    return (
        <div>
            <p>Name: {user?.name}</p>
            <button onClick={() => scopedState.update('user', { name: 'Update Name' })}>
                Update Name
            </button>

            <button onClick={handleClearName}>
                Clear Name
            </button>

            <p>Last Name: {user?.lastName}</p>
            <button onClick={handleClearLastName}>
                Clear Last Name
            </button>

            <p>Token: {tokenStore?.token}</p>
            <button onClick={handleConfirmToken}>
                Add New Token
            </button>
            <button onClick={handleClearToken}>
                Clear Token
            </button>

            <button onClick={handleClearAll}>
                Clear All
            </button>
        </div>
    );
}

```

## 🛠️ Features
- 🔹 Simple and efficient global state.
- 🔹 Support for multiple state scopes.
- 🔹 Persistence via localStorage (focused on client-side Next.js).
- 🔹 Optional persistence via Cookie (focused on server-side Next.js).
- 🔹 Eliminates the need for prop drilling and multiple useStates.

### Example of a middleware using Cookies
```tsx
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    const cookieValue = request.cookies.get("scopedState_verificarScope")?.value;
    const scopedState = cookieValue ? JSON.parse(cookieValue) : null;

    const token = scopedState?.verificar.token ?? undefined;

    if (!token && request.nextUrl.pathname === '/teste') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next(); // Continue the request normally
}

export const config = {
    matcher: ['/teste'] // Directly use the array here
};
```


## 🤝 Contributing
Feel free to open issues and pull requests.

## 📄 License
This project is licensed under the MIT License.

---
--
---