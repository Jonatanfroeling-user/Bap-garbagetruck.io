import { Box, Image } from "@chakra-ui/react";
import { getItemSizeArray } from "../utils/helpers";
import { ItemSizeType } from "../types";
import { IconType } from "react-icons/lib";
import { ReactNode } from "react";

type SquareProps = {
  size?: ItemSizeType;
  bgImg?: string;
  background?: string;
  outline?: string | null;
  icon?: IconType;
  bgContain?: boolean;
  children?: ReactNode;
};

const SquareItem = ({
  size = 2,
  outline = "white",
  background,
  bgImg,
  icon: Icon,
  children,
  bgContain = false,
}: SquareProps) => {
  const [sizePx, sizeNr] = getItemSizeArray(size);

  return (
    <Box
      boxShadow="0 2px 5px 3px #3337"
      w={sizePx}
      h={sizePx}
      transform="rotate(45deg)"
      borderRadius={5}
      bg={background}
      overflow="hidden"
      pos="relative"
      border={outline === null ? undefined : `${size * 1.5}px solid`}
      borderColor={
        outline === null
          ? undefined
          : outline.includes("primary")
          ? outline
          : "white"
      }
      transition="all 0s"
      cursor="pointer"
    >
      <Box
        w="150%"
        h="150%"
        top="-25%"
        left="-25%"
        pos="absolute"
        borderRadius={5}
        overflow="hidden"
        transform="rotate(-45deg)"
        backgroundImage={bgImg}
        backgroundSize={bgContain ? "contain" : "cover"}
        // backgroundSize="90%"
        backgroundRepeat="no-repeat"
        backgroundPosition="top"
        transition="all 0s"
      >
        {(Icon || children) && (
          <Box
            color="white"
            fontSize={`${sizeNr / 2}px`}
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
          >
            {children}
            {Icon && <Icon color="white" />}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SquareItem;
