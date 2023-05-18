import { ReviewOverviewOutput } from "./review_overview.output";

export interface ReviewDetailOutput
  extends Omit<ReviewOverviewOutput, "overview"> {}
