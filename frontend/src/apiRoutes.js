const ApiRoutes = {
    login: '/auth/login',
    signup: '/auth/register',

    allProducts: '/product',
    submitReview: '/product-review',
    searchProducts: '/search',
    getCartItems: '/get-cart-items',

    banners: '/display-banners',

    getUserInfo: '/me',

    categories: '/category',

    orders: {
        place: '/order/place'
    },

    admin: {
        user: {
            getAll: '/user/get-users',
            getAllAdmins: '/user/get-admins',
            edit: '/user/edit',
            registerAdmin: '/auth/register-admin',
            deleteUser: '/user/delete/'
        },
        banners: {
            getAll: '/banner',
            create: '/banner',
            delete: '/banner/',
            updateBannerActivity: '/update-banner-activity'
        },
        products: {
            getAll: '/product',
            create: '/product',
            delete: '/product/'
        },
        orders: {
            getAll: '/order'
        }
    }
}

export default ApiRoutes;