import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { PropsWithChildren } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
}>;

export default function EmojiModal({
  isVisible,
  children,
  onClose,
  onEmojiSelect,
}: Props) {
  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Choose an Emoji</Text>
          <Pressable onPress={onClose}>
            <MaterialIcons name="close" color="#fff" size={22} />
          </Pressable>
        </View>
        <Text
          style={{
            textAlign: "center",
            marginTop: 55,
            fontWeight: "bold",
            color: "#FFF",
          }}
        >
          WILL BE ADDED LATER VERSIONS
        </Text>
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  emojiPickerContainer: {
    flex: 1,
  },
  modalContent: {
    height: "25%",
    flex: 1,
    width: "100%",
    backgroundColor: "#25292e",
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: "absolute",
    bottom: 0,
  },
  titleContainer: {
    height: "16%",
    backgroundColor: "#464C55",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#fff",
    fontSize: 16,
  },
  emojipicker: {
    height: "auto",
    width: "auto",
  },
});
