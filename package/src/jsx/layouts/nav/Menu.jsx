export const MenuList = [
    // Dashboard
    {
        title: 'Dashboard',    
        classsChange: 'mm-collapse',        
        iconStyle: <i className="flaticon-381-networking"/>,
        content: [
            {
                title: 'Dashboard',
                to: 'dashboard',                    
                roles: ['superAdmin', 'admin'] // Accessible par superAdmin et admin
            },
            {
                title: 'List of Admins',
                to: 'list-admin',
                roles: ['superAdmin'] // Accessible uniquement par superAdmin
            },                      
            {
                title: 'List of Users',
                to: 'orders',
                roles: ['admin'] // Accessible uniquement par admin
            },
        ],
    },
    
    // Settings
    {
        title: 'Settings',    
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-381-controls-3"/>,
        content: [
            {
                title: 'Profile',
                to: 'post-details',
                roles: ['superAdmin', 'admin'] // Accessible par superAdmin et admin
            }
        ]
    },
];

// Fonction pour filtrer le menu en fonction du rôle de l'utilisateur
export const getFilteredMenu = (userRole) => {
    return MenuList.map(section => ({
        ...section,
        content: section.content.filter(item => item.roles.includes(userRole))
    })).filter(section => section.content.length > 0); // Ne garder que les sections avec du contenu
};