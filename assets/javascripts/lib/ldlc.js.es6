const LDLC_LINK_REGEX = /((?:https?:)?(?:\/\/)?(?:www\.)?ldlc\.[^\b\s"'<>\(\)\[\]]+)/ig;

export function ldlc(text, helper) {
  const tag = helper.getOptions().tags["ldlc.com"];
  return tag ? text.replace(LDLC_LINK_REGEX, href => `${href}#${tag}`) : text;
}
