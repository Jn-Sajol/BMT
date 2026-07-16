"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBreakpoint = useBreakpoint;
const react_1 = require("react");
function useBreakpoint() {
    const [isMobile, setIsMobile] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);
    return { isMobile };
}
//# sourceMappingURL=useBreakpoint.js.map