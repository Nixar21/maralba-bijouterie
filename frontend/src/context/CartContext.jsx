import { createContext, useContext, useReducer } from 'react'

const CartContext = createContext()

function cartReducer(state, action) {
    switch (action.type) {
    case 'ADD': {
        const exists = state.items.find(i => i.id === action.payload.id)
        if (exists) {
        return { ...state, items: state.items.map(i =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
        )}
        }
        return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] }
    }
    case 'REMOVE':
        return { ...state, items: state.items.filter(i => i.id !== action.payload) }
    case 'UPDATE_QTY':
        return { ...state, items: state.items.map(i =>
        i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i
        )}
    case 'CLEAR':
        return { ...state, items: [] }
    default:
        return state
    }
}

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const total = state.items.reduce((sum, i) => sum + i.precio * i.qty, 0)
    const count = state.items.reduce((sum, i) => sum + i.qty, 0)

    return (
    <CartContext.Provider value={{
        items: state.items,
        total,
        count,
        addToCart: (product) => dispatch({ type: 'ADD', payload: product }),
        removeFromCart: (id) => dispatch({ type: 'REMOVE', payload: id }),
        updateQty: (id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { id, qty } }),
        clearCart: () => dispatch({ type: 'CLEAR' })
    }}>
        {children}
    </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)