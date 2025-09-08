const KEY = 'am_urls_v1'

export function loadAll(){
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function saveAll(items){
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function upsert(item){
  const items = loadAll()
  const idx = items.findIndex(x => x.shortcode === item.shortcode)
  if (idx >= 0) items[idx] = item
  else items.push(item)
  saveAll(items)
  return item
}

export function findByCode(code){
  return loadAll().find(x => x.shortcode === code) || null
}
