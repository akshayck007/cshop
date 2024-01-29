const allLikeButtons = document.querySelectorAll(".btn-like");
for (let btn of allLikeButtons) {
  btn.addEventListener("click", () => {
    const productId = btn.getAttribute("product-id");
    likeButton(productId);
    btn.querySelector("i").classList.toggle("fa-solid");
    btn.querySelector("i").classList.toggle("fa-regular");
  });
}

async function likeButton(productId) {
  try {
    const response = await axios({
      method: "post",
      url: `/products/${productId}/like`,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    });
  } catch (error) {
    window.location.replace("/login");
  }
}
