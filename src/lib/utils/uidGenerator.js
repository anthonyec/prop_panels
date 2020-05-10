export default function uidGenerator() {
  let uid = 0;

  return () => {
    uid += 1;

    return uid;
  };
}
