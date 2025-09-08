const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function randomCode(len = 6){
  let out = ''
  for (let i=0;i<len;i++){
    out += ALPHABET[Math.floor(Math.random()*ALPHABET.length)]
  }
  return out
}

export function isValidCustom(code){
  return /^[0-9a-zA-Z]{3,15}$/.test(code)
}
