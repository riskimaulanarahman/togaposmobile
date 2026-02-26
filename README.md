# TOGA Mobile Prototype

Prototype mobile UI/UX TOGA POS berbasis **Next.js + Tailwind CSS** dengan data mock.

## Cakupan Modul

- Hub (Outlet & Langganan + Approval & Audit)
- Operasional
- Master Data
- Inventory
- Reports
- Support flow: role switch, outlet switch, login prototype

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Context store (`src/stores`) sebagai state global prototype

## Menjalankan Project

```bash
npm install
npm run dev
```

Buka: `http://localhost:3000`

## Struktur Penting

- `app/(mobile)/hub`
- `app/(mobile)/operasional`
- `app/(mobile)/master`
- `app/(mobile)/inventory`
- `app/(mobile)/reports`
- `app/(auth)/login`
- `app/(support)/role-switch`
- `app/(support)/outlet-switch`

- `src/types` kontrak type
- `src/mocks` dataset mock
- `src/stores` context/session/outlet/report state
- `src/services` async contract layer (`getList/getDetail/create/update/approve/reject`)

## Catatan

- Prototype ini belum terhubung API backend nyata.
- Flow approval, inventory movement, session kasir, dan report filter sudah clickable end-to-end berbasis mock state.
