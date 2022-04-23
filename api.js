class JSONRPCException {
    constructor(code) {
        this.code = code;
    }
}

class Api {
    constructor() {

    }

    async login(phone, password) {
        const result = await this.call("login", {"phone": phone, "password": password})

        console.log(result)
    }

    order() {

    }

    async call(method, params) {
        let response = await fetch('https://functions.yandexcloud.net/d4esca80sgcmhl0hsrmc', {
            method: "POST",
            body: JSON.stringify({
                "jsonrpc": "2.0",
                "id": 1,
                "method": method,
                "params": params
            })
        });

        if (response.ok) {
            response = await response.json();
            if (response.error != null) {
                console.error(`API error: ${response.error.message}`)
                throw new JSONRPCException(response.error.code);
            } else {
                return response.result;
            }
        } else {
            console.error(`Can't call function ${method} due to network error`)
        }
    }
}

export default Api