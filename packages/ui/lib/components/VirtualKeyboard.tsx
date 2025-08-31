import { useStorage, virtualKeyboard } from "@extension/shared";
import { virtualKeyboardStorage } from "@extension/storage";
import { ArrowBigUpDashIcon, ArrowBigUpIcon, ChevronDownIcon, DeleteIcon, GlobeIcon } from "lucide-react";
import { type ReactNode, useReducer, useRef } from "react";

export enum Language {
  English = "english",
  Number = "number",
}

export enum KeyboardVariant {
  Uppercase = "uppercase",
  Lowercase = "lowercase",
  Number = "number",
  ShiftNumber = "shift-number",
}

type KeyboardState = {
  language: Language;
  permanentShift: boolean; // Shift 永久切換
  temporaryShift?: boolean; // Shift 暫時切換
};

type Action =
  | { type: "SWITCH_LANGUAGE"; language: Language }
  | { type: "TOGGLE_TEMP_SHIFT" }
  | { type: "TOGGLE_PERMANENT_SHIFT" }
  | { type: "RESET_TEMP_SHIFT" };

function keyboardReducer(state: KeyboardState, action: Action): KeyboardState {
  switch (action.type) {
    case "SWITCH_LANGUAGE":
      return { ...state, language: action.language, temporaryShift: undefined };
    case "TOGGLE_TEMP_SHIFT":
      return { ...state, temporaryShift: !state.temporaryShift };
    case "TOGGLE_PERMANENT_SHIFT":
      return { ...state, temporaryShift: undefined, permanentShift: !state.permanentShift };
    case "RESET_TEMP_SHIFT":
      return { ...state, temporaryShift: undefined };
    default:
      return state;
  }
}

// 計算實際生效的 shift
const isShiftActive = (state: KeyboardState) => {
  if (state.temporaryShift === undefined) {
    return state.permanentShift; // 如果 temporaryShift 未定義，則只使用 permanentShift
  }
  return state.temporaryShift;
};

type Key = {
  char: ReactNode;
  value: string;
  minWidth?: string;
  onClick?: () => void;
  onDblClick?: () => void;
};

export const VirtualKeyboard = () => {
  const shiftClickTimer = useRef<NodeJS.Timeout | null>(null);

  const { isActive } = useStorage(virtualKeyboardStorage);
  const [keyboardState, dispatch] = useReducer(keyboardReducer, {
    language: Language.English,
    permanentShift: false,
  });

  const handleShiftClick = () => {
    if (shiftClickTimer.current) clearTimeout(shiftClickTimer.current);
    shiftClickTimer.current = setTimeout(() => {
      if (keyboardState.permanentShift) {
        dispatch({ type: "TOGGLE_PERMANENT_SHIFT" });
        return;
      }
      dispatch({ type: "TOGGLE_TEMP_SHIFT" });
    }, 200);
  };

  const handleShiftDoubleClick = () => {
    if (shiftClickTimer.current) clearTimeout(shiftClickTimer.current);
    dispatch({ type: "TOGGLE_PERMANENT_SHIFT" });
  };

  if (!isActive) return;

  const keyboardLayouts: Record<KeyboardVariant, Key[][]> = {
    [KeyboardVariant.Lowercase]: [
      [
        { char: "q", value: "q" },
        { char: "w", value: "w" },
        { char: "e", value: "e" },
        { char: "r", value: "r" },
        { char: "t", value: "t" },
        { char: "y", value: "y" },
        { char: "u", value: "u" },
        { char: "i", value: "i" },
        { char: "o", value: "o" },
        { char: "p", value: "p" },
        { char: "[", value: "[" },
        { char: "]", value: "]" },
        { char: "\\", value: "\\" },
        {
          char: <DeleteIcon className="size-[18px] stroke-[1.5]" />,
          value: "",
          minWidth: "140px",
          onClick: () => virtualKeyboard.backspace(),
        },
      ],
      [
        { char: "a", value: "a" },
        { char: "s", value: "s" },
        { char: "d", value: "d" },
        { char: "f", value: "f" },
        { char: "g", value: "g" },
        { char: "h", value: "h" },
        { char: "j", value: "j" },
        { char: "k", value: "k" },
        { char: "l", value: "l" },
        { char: ";", value: ";" },
        { char: "'", value: "'" },
        { char: "Enter", value: "\n", minWidth: "160px", onClick: () => virtualKeyboard.enter() },
      ],
      [
        { char: "z", value: "z" },
        { char: "x", value: "x" },
        { char: "c", value: "c" },
        { char: "v", value: "v" },
        { char: "b", value: "b" },
        { char: "n", value: "n" },
        { char: "m", value: "m" },
        { char: ",", value: "," },
        { char: ".", value: "." },
        { char: "/", value: "/" },
        {
          char: keyboardState.permanentShift ? (
            <ArrowBigUpDashIcon className="size-[18px] stroke-[1.5]" />
          ) : (
            <ArrowBigUpIcon className="size-[18px] stroke-[1.5]" />
          ),
          value: "",
          minWidth: "120px",
          onClick: handleShiftClick,
          onDblClick: handleShiftDoubleClick,
        },
      ],
      [
        {
          char: <GlobeIcon className="size-[18px] stroke-[1.5]" />,
          value: "",
          onClick: () => dispatch({ type: "SWITCH_LANGUAGE", language: Language.Number }),
        },
        { char: ".com", value: ".com" },
        { char: "@", value: "@" },
        { char: "Space", value: " ", minWidth: "80%" },
        {
          char: <ChevronDownIcon className="size-[18px] stroke-[1.5]" />,
          value: "",
          onClick: () => virtualKeyboard.clearFocus(),
        },
      ],
    ],
    [KeyboardVariant.Uppercase]: [
      [
        { char: "Q", value: "Q" },
        { char: "W", value: "W" },
        { char: "E", value: "E" },
        { char: "R", value: "R" },
        { char: "T", value: "T" },
        { char: "Y", value: "Y" },
        { char: "U", value: "U" },
        { char: "I", value: "I" },
        { char: "O", value: "O" },
        { char: "P", value: "P" },
        { char: "[", value: "[" },
        { char: "]", value: "]" },
        { char: "\\", value: "\\" },
        {
          char: <DeleteIcon className="size-[18px] stroke-[1.5]" />,
          value: "",
          minWidth: "140px",
          onClick: () => virtualKeyboard.backspace(),
        },
      ],
      [
        { char: "A", value: "A" },
        { char: "S", value: "S" },
        { char: "D", value: "D" },
        { char: "F", value: "F" },
        { char: "G", value: "G" },
        { char: "H", value: "H" },
        { char: "J", value: "J" },
        { char: "K", value: "K" },
        { char: "L", value: "L" },
        { char: ";", value: ";" },
        { char: "'", value: "'" },
        { char: "Enter", value: "\n", minWidth: "160px", onClick: () => virtualKeyboard.enter() },
      ],
      [
        { char: "Z", value: "Z" },
        { char: "X", value: "X" },
        { char: "C", value: "C" },
        { char: "V", value: "V" },
        { char: "B", value: "B" },
        { char: "N", value: "N" },
        { char: "M", value: "M" },
        { char: ",", value: "," },
        { char: ".", value: "." },
        { char: "/", value: "/" },
        {
          char: keyboardState.permanentShift ? (
            <ArrowBigUpDashIcon className="size-[18px] stroke-[1.5]" />
          ) : (
            <ArrowBigUpIcon className="size-[18px] stroke-[1.5]" />
          ),
          value: "",
          minWidth: "120px",
          onClick: handleShiftClick,
          onDblClick: handleShiftDoubleClick,
        },
      ],
      [
        {
          char: <GlobeIcon className="size-[18px] stroke-[1.5]" />,
          value: "",
          onClick: () => dispatch({ type: "SWITCH_LANGUAGE", language: Language.Number }),
        },
        { char: ".com", value: ".com" },
        { char: "@", value: "@" },
        { char: "Space", value: " ", minWidth: "80%" },
        {
          char: <ChevronDownIcon className="size-[18px] stroke-[1.5]" />,
          value: "",
          onClick: () => virtualKeyboard.clearFocus(),
        },
      ],
    ],
    [KeyboardVariant.Number]: [
      [
        { char: "1", value: "1" },
        { char: "2", value: "2" },
        { char: "3", value: "3" },
      ],
      [
        { char: "4", value: "4" },
        { char: "5", value: "5" },
        { char: "6", value: "6" },
      ],
      [
        { char: "7", value: "7" },
        { char: "8", value: "8" },
        { char: "9", value: "9" },
      ],
      [
        {
          char: "Shift",
          value: "",
          onClick: handleShiftClick,
          onDblClick: handleShiftDoubleClick,
        },
        { char: "0", value: "0" },
        { char: "-", value: "-" },
      ],
      [
        {
          char: <GlobeIcon className="size-[18px] stroke-[1.5]" />,
          value: "",
          onClick: () => dispatch({ type: "SWITCH_LANGUAGE", language: Language.English }),
        },
        {
          char: <DeleteIcon className="size-[18px] stroke-[1.5]" />,
          value: "",
          minWidth: "140px",
          onClick: () => virtualKeyboard.backspace(),
        },
      ],
    ],
    [KeyboardVariant.ShiftNumber]: [
      [
        { char: "!", value: "!" },
        { char: "/", value: "/" },
        { char: "#", value: "#" },
      ],
      [
        { char: "$", value: "$" },
        { char: "%", value: "%" },
        { char: "^", value: "^" },
      ],
      [
        { char: "&", value: "&" },
        { char: "*", value: "*" },
        { char: "(", value: "(" },
      ],
      [
        {
          char: "Shift",
          value: "",
          onClick: handleShiftClick,
          onDblClick: handleShiftDoubleClick,
        },
        { char: ")", value: ")" },
        { char: "+", value: "+" },
      ],
      [
        {
          char: <GlobeIcon className="size-[18px] stroke-[1.5]" />,
          value: "",
          onClick: () => dispatch({ type: "SWITCH_LANGUAGE", language: Language.English }),
        },
        {
          char: <DeleteIcon className="size-[18px] stroke-[1.5]" />,
          value: "",
          minWidth: "140px",
          onClick: () => virtualKeyboard.backspace(),
        },
      ],
    ],
  };

  // 計算目前使用哪個 layout
  const layoutKey: KeyboardVariant = (() => {
    switch (keyboardState.language) {
      case Language.English: {
        if (isShiftActive(keyboardState)) return KeyboardVariant.Uppercase;
        return KeyboardVariant.Lowercase;
      }
      case Language.Number: {
        if (isShiftActive(keyboardState)) return KeyboardVariant.ShiftNumber;
        return KeyboardVariant.Number;
      }
      default:
        return KeyboardVariant.Lowercase;
    }
  })();

  return (
    <div
      id="kiosk-virtual-keyboard"
      className="z-50 mx-auto flex w-fit items-center gap-2 rounded bg-gray-200 px-2 py-1 text-black"
    >
      <div className="flex flex-col gap-2">
        {keyboardLayouts[layoutKey].map((row, rowIndex) => (
          <div key={layoutKey + rowIndex} className="flex flex-row flex-nowrap gap-2">
            {row.map((key) => (
              <KeyButton
                key={crypto.randomUUID()}
                label={key.char}
                minWidth={key.minWidth}
                onClick={async () => {
                  if (key.onClick) {
                    key.onClick();
                  } else {
                    await virtualKeyboard.typeCharacter(key.value);
                    dispatch({ type: "RESET_TEMP_SHIFT" });
                  }
                }}
                onDblClick={key.onDblClick}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const KeyButton = ({
  label,
  minWidth,
  onClick,
  onDblClick,
}: {
  label: ReactNode;
  minWidth?: string;
  onClick?: () => void;
  onDblClick?: () => void;
}) => {
  return (
    <button
      type="button"
      style={{ minWidth }}
      className="key bounded-md flex size-12 w-full flex-1 items-center justify-center bg-gray-50 text-lg hover:bg-gray-300 focus:outline-none sm:size-14 lg:size-16"
      onClick={onClick}
      onDoubleClick={onDblClick}
    >
      {label}
    </button>
  );
};
