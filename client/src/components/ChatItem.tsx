import { Text } from "grommet";
import styled from "styled-components";

interface ChatItemPropsType {
  className?: string;
  name: string;
  value: string;
  owner?: boolean;
}

const ChatItem = ({
  className,
  name = "",
  owner = false,
  value,
}: ChatItemPropsType) => {
  // const formatMessage = (text: string) => {
  //   let regex =
  //     /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  //   let res = text.replace(regex, (url: string) => {
  //     return `<Anchor href=${url} label=${url} />`;
  //   });
  //   return <div>{res}</div>;
  // };

  return (
    <div className={className}>
      <Text size="small">{name}</Text>
      <Text>{value}</Text>
    </div>
  );
};

const CustomChatItem = styled(ChatItem)`
  background: ${(props) => (props.owner ? "#00C781" : "#f8f8f8")};
  padding: 12px;
  margin: 0.5em;
  border-radius: 12px;
  display: flex;
  align-self: ${(props) => (props.owner ? "end" : "start")};
  flex-direction: column;
`;

export default CustomChatItem;
