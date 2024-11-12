import { FC } from "react";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";

interface IPickerProps {
  colorValue: string;
}

const Picker: FC<IPickerProps> = ({ colorValue }) => {
  const [color, setColor] = useColor(colorValue);

  return <ColorPicker color={color} onChange={setColor} height={200} />;
};

export default Picker;
