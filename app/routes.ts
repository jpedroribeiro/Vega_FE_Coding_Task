import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("assets", "routes/assets.ts"),
    route("dashboard", "routes/dashboard.tsx"),
] satisfies RouteConfig;
