import React from 'react';
import {useScopedState} from "./../scopedstate";

const TestComponent = () => {
    const scopedState = useScopedState('userScope');
    const ServerScope = useScopedState('ServerScope', { server: true });
    // Obtém o estado inicial do usuário
    const user = scopedState.get<{ name: string; lastName: string }>('user');
    const tokenStore = ServerScope.get<{ token: string }>("Server");

    // Utiliza clearIndex para remover somente o campo "nome" do objeto "user"
    const handleClearName = async () => {
        await scopedState.clearIndex("userScope", "user", 'name');
    };

    const handleClearlastName = async () => {
        await scopedState.clearIndex('userScope', "user", "lastName");
    };

    const handleClearToken = async () => {
        await ServerScope.clearKey('ServerScope', "Server");
    };

    const handleClearAll = async () => {
        await scopedState.clearAll('userScope');
        await ServerScope.clearAll('ServerScope');

    };

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
};

export default TestComponent;



