import { Text, Anchor } from "grommet";
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
  const formatMessage = (text: string) => {
    let regex =
      /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;

    let res = text
      .split(" ")
      .map((w, i) =>
        regex.test(w) ? (
          <Anchor key={w + i} href={w} label={`${w} `} />
        ) : (
          <Text key={w + i}>{w} </Text>
        )
      );

    return res;
  };

  return (
    <div className={className}>
      <Text size="small">{name}</Text>
      <div>{formatMessage(value)}</div>
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
