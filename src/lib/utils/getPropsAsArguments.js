export default function getPropsAsArguments(props) {
  let args = {};

  props.forEach((prop) => {
    args[prop.id] = prop.default;
  });

  return args;
}
