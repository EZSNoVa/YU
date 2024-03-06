export const Jokers = {
    Skip: "Avoid having to comply with the sentence",
    Mirror: "Makes the other player have to comply with the sentence as well. Only once; +4 doesn't affect Mirror",
    Gaze: "10% worth of words of the sentence will be revealed",
    Decoy: "At the end of the round, round will be restarted",
    Darkness: "Respondent options will be hidden and randomly mixed-up",
    Illusion: "Time will be reduced by half, third, or quarter, randomly",
    Foresight: "Prevent other player from using a joker",
    Revelation: "Reveal 2 of other player's jokers"
};
export var ResponseType;
(function (ResponseType) {
    ResponseType["DO_IT"] = "DO_IT";
    ResponseType["PLUS_FOUR"] = "PLUS_FOUR";
    ResponseType["REVERSE"] = "REVERSE";
})(ResponseType || (ResponseType = {}));
export var Role;
(function (Role) {
    Role["JUDGE"] = "Judge";
    Role["RESPONDENT"] = "Respondent";
})(Role || (Role = {}));
