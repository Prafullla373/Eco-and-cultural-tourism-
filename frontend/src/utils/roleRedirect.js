export const getDashboardPath = (role) => {
    switch (role) {
        case "super_admin":
            return "/admin/dashboard";
        case "hotel_manager":
            return "/admin/hotels";
        case "cultural_manager":
            return "/admin/culture";
        case "eco_manager":
            return "/admin/eco";
        case "event_manager":
            return "/admin/events";
        case "package_manager":
            return "/admin/packages";
        default:
            return "/admin/dashboard";
    }
};
