describe("TV show functions", function() {
  it("should return an empty array if show is invalid", async function() {
    const result = await getShowsByTerm("fdsafdrewqrrewesa");
    expect(result).toEqual([]);
  })
})

describe("TV Episodes functions", function() {
  it("should return empty array if no episodes", async function() {
    const result = await getEpisodesOfShow(76540)
    expect(result).toThrowError();
  })
})
