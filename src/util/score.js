export const calculateScore = (player) => { // TODO: depends on number of correct responses, voting, and time of responses
    let correctResponses = 0;
    player.responses.forEach((response) => { correctResponses += response.isCorrect; });
    return correctResponses * 100;
};