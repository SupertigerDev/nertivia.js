import fetch from 'node-fetch';

export function postJSON (token:string, path:string, json:any) {
    return fetch(`https://supertiger.tk/${path}`, {
        method: "post",
        headers: {
            'authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    })
}