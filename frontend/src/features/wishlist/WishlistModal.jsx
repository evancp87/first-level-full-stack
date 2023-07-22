import {useSelector, useDispatch} from "react-redux";

const WishlistModal = () => {
const dispatch = useDispatch();
const wishlists = useSelector(selectWishLists)
    // things to do
    // show modal
    // close modal
    // create 
    return (  
<div>



{/* You can open the modal using ID.showModal() method */}
<button className="btn" onClick={()=>window.my_modal_3.showModal()}>open modal</button>
<dialog id="my_modal_3" className="modal">
  <form method="dialog" className="modal-box">
    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>

    <div>

    <h3>Save to</h3>
    <button>X</button>
</div>
<div>
 {/* map over wishlists here */}
 {wishlists.map(list => list)}
    <input type="checkbox" />
</div>

    <h3 className="font-bold text-lg">Hello!</h3>
    <p className="py-4">Press ESC key or click on ✕ button to close</p>

<div>
<div>
<p>Create wishlist</p>
<p>+</p>
</div>
{/* {showAddWishlist && (
    <div>
        <h3>Name</h3>
        <input type="text" />
    </div>
)} */}
</div>
{/* if clicked show option to create wishlist */}

  </form>
</dialog>
</div>
    );
}

export default WishlistModal