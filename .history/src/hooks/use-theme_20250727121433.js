import { useTheme } from "next-themes";

export const useCustomTheme = () => {
  const { theme, setTheme } = useTheme();
  return { theme, setTheme };
};