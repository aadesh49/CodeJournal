import { Outlet } from "react-router-dom";
import Header from "./Header";
import Spline from '@splinetool/react-spline';

export default function Layout() {
    return (
        <div className="relative min-h-screen w-full">
      {/* Background Spline Scene */}
      <div className="fixed inset-0 w-full h-full">
        <Spline scene="https://prod.spline.design/ci7WIj7AGNUEYvlG/scene.splinecode" />
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        <Header />
        <Outlet />
      </main>
    </div>
    )
}