import { cartActionTypes } from './action';

const cartInitialState = {
  items: [],
};

export default function reducer(state = cartInitialState, action) {
  switch (action.type) {
    case cartActionTypes.ADD_ITEM: {
      const exist = state.items.find(
        (el) => el.product.name === action.item.name
      );

      if (exist) {
        const newItems = state.items.map((el) => {
          if (el.product.name === action.item.name)
            return {
              product: action.item,
              quantity: Number(el.quantity) + Number(action.quantity),
            };
          return el;
        });

        return {
          ...state,
          items: newItems,
        };
      }
      const newItems = [
        ...state.items,
        { product: action.item, quantity: Number(action.quantity) },
      ];

      return {
        ...state,
        items: newItems,
      };
    }

    case cartActionTypes.REMOVE_ITEM: {
      const newItems = state.items.reduce((result, el) => {
        if (el.product.name === action.item.name) {
          if (Number(el.quantity) > 1) {
            return result.concat({
              product: action.item,
              quantity: Number(el.quantity) - 1,
            });
          }
        } else return result.concat(el);

        return result;
      }, []);

      return {
        ...state,
        items: newItems,
      };
    }

    case cartActionTypes.SET_INITIAL_STATE: {
      return {
        ...state,
        items: action.items,
      };
    }

    default:
      return state;
  }
}
